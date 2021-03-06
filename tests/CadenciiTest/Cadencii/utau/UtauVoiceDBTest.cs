using NUnit.Framework;
using cadencii;
using cadencii.vsq;
using cadencii.utau;

namespace cadencii.test.utau
{
    [TestFixture]
    class UtauVoiceDBTest
    {
        [Test]
        public void test()
        {
            var config = new SingerConfig();
            config.VOICEIDSTR = "./fixture/utau_voice_db";
            var db = new UtauVoiceDB(config);
            {
                var actual = db.attachFileNameFromLyric("あ", 60);
                Assert.AreEqual("あ", actual.Alias);
                Assert.AreEqual("あ.wav", actual.fileName);
                Assert.AreEqual(6f, actual.msOffset);
                Assert.AreEqual(52f, actual.msConsonant);
                Assert.AreEqual(69f, actual.msBlank);
                Assert.AreEqual(1f, actual.msPreUtterance);
                Assert.AreEqual(2f, actual.msOverlap);
            }
            {
                var actual = db.attachFileNameFromLyric("わ", 61);
                Assert.AreEqual("わ↑", actual.Alias);
                Assert.AreEqual(@"A\わ↑.wav", actual.fileName);
            }
        }
    }
}
